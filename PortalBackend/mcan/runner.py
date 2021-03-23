import sys
import time
from collections import OrderedDict

import pyprind
import torch

from .data import MatchingIterator
from .optim import Optimizer, SoftNLLLoss
from .utils import tally_parameters


class Statistics(object):
    def __init__(self):
        self.loss_sum = 0
        self.examples = 0
        self.tps = 0
        self.tns = 0
        self.fps = 0
        self.fns = 0
        self.start_time = time.time()

    def update(self, loss=0, tps=0, tns=0, fps=0, fns=0):
        examples = tps + tns + fps + fns
        self.loss_sum += loss * examples
        self.tps += tps
        self.tns += tns
        self.fps += fps
        self.fns += fns
        self.examples += examples

    def loss(self):
        return self.loss_sum / self.examples

    def f1(self):
        prec = self.precision()
        recall = self.recall()
        return 2 * prec * recall / max(prec + recall, 1)

    def precision(self):
        return 100 * self.tps / max(self.tps + self.fps, 1)

    def recall(self):
        return 100 * self.tps / max(self.tps + self.fns, 1)

    def accuracy(self):
        return 100 * (self.tps + self.tns) / self.examples

    def examples_per_sec(self):
        return self.examples / (time.time() - self.start_time + 1)


class Runner(object):
    @staticmethod
    def _print_final_stats(epoch, runtime, datatime, stats):
        """print(('Finished Epoch {epoch} || Run Time: {runtime:6.1f} | '
               'Load Time: {datatime:6.1f} || F1: {f1:6.2f} | Prec: {prec:6.2f} | '
               'Rec: {rec:6.2f} || Ex/s: {eps:6.2f}\n').format(
                   epoch=epoch,
                   runtime=runtime,
                   datatime=datatime,
                   f1=stats.f1(),
                   prec=stats.precision(),
                   rec=stats.recall(),
                   eps=stats.examples_per_sec()))"""

        print(('Finished!').format(
            epoch=epoch,
            runtime=runtime,
            datatime=datatime,
            f1=stats.f1(),
            prec=stats.precision(),
            rec=stats.recall(),
            eps=stats.examples_per_sec()))

    @staticmethod
    def _compute_scores(output, target):
        predictions = output.max(1)[1].data
        correct = (predictions == target.data).float()
        incorrect = (1 - correct).float()
        positives = (target.data == 1).float()
        negatives = (target.data == 0).float()

        tp = torch.dot(correct, positives)
        tn = torch.dot(correct, negatives)
        fp = torch.dot(incorrect, negatives)
        fn = torch.dot(incorrect, positives)

        return tp, tn, fp, fn

    @staticmethod
    def _run(run_type,
             model,
             dataset,
             criterion=None,
             optimizer=None,
             train=False,
             device=None,
             batch_size=16,
             batch_callback=None,
             epoch_callback=None,
             progress_style='bar',
             log_freq=5,
             sort_in_buckets=None,
             return_predictions=False,
             **kwargs):

        if device == 'cpu':
            model = model.cpu()
            if criterion:
                criterion = criterion.cpu()
        elif torch.cuda.is_available():
            model = model.cuda()
            device = 'cuda'
            if criterion:
                criterion = criterion.cuda()
        elif device == 'gpu':
            raise ValueError('No GPU available.')

        sort_in_buckets = train
        run_iter = MatchingIterator(
            dataset,
            model.meta,
            train,
            batch_size=batch_size,
            device=device,
            sort_in_buckets=sort_in_buckets)

        ### change here
        if train:
            model.train()
        elif eval:
            model.eval()
        else:
            model.predict()

        epoch = model.epoch
        datatime = 0
        runtime = 0
        cum_stats = Statistics()
        stats = Statistics()
        predictions = []
        id_attr = model.meta.id_field
        label_attr = model.meta.label_field

        if train and epoch == 0:
            print('* Number of trainable parameters:', tally_parameters(model))

        epoch_str = 'Epoch {0:d}'.format(epoch + 1)
        #print('===> ', run_type, epoch_str)
        batch_end = time.time()

        pbar = pyprind.ProgBar(len(run_iter) // log_freq, bar_char='*', width=30)

        for batch_idx, batch in enumerate(run_iter):
            batch_start = time.time()
            datatime += batch_start - batch_end

            output = model(batch)
            #print("testing batch output:"+str(output))

            loss = float('NaN')
            if criterion:
                loss = criterion(output, getattr(batch, label_attr))

            if hasattr(batch, label_attr):
                scores = Runner._compute_scores(output, getattr(batch, label_attr))
            else:
                scores = [0] * 4

            cum_stats.update(float(loss), *scores)
            stats.update(float(loss), *scores)

            if return_predictions:
                for idx, id in enumerate(getattr(batch, id_attr)):
                    predictions.append((id, float(output[idx, 1].exp())))


            if (batch_idx + 1) % log_freq == 0:
                pbar.update()
                stats = Statistics()

            if train:
                model.zero_grad()
                loss.backward()

                if not optimizer.params:
                    optimizer.set_parameters(model.named_parameters())
                optimizer.step()

            batch_end = time.time()
            runtime += batch_end - batch_start

        sys.stderr.flush()

        """Output prediction here"""
        #print("testing predictions:" + str(predictions))
        # for pred in predictions:
        #     if pred[1]>0.5:
        #         print("We are " + str(round(pred[1],4)*100) + "% sure record no." + str(pred[0]) + " is your breach data.")
        #     else:
        #         continue

        Runner._print_final_stats(epoch + 1, runtime, datatime, cum_stats)
        return cum_stats.f1(), predictions

    @staticmethod
    def train(model,
              train_dataset,
              validation_dataset,
              best_save_path,
              epochs=10,
              criterion=None,
              optimizer=None,
              pos_neg_ratio=None,
              label_smoothing=0.05,
              save_every_prefix=None,
              save_every_freq=1,
              **kwargs):
        model.initialize(train_dataset)

        model._register_train_buffer('optimizer_state', None)
        model._register_train_buffer('best_score', None)
        model._register_train_buffer('epoch', None)

        if criterion is None:
            if pos_neg_ratio is None:
                pos_neg_ratio = 1
            else:
                assert pos_neg_ratio > 0
            pos_weight = 2 * pos_neg_ratio / (1 + pos_neg_ratio)

            neg_weight = 2 - pos_weight

            criterion = SoftNLLLoss(label_smoothing,
                                    torch.Tensor([neg_weight, pos_weight]))

        optimizer = optimizer or Optimizer()
        if model.optimizer_state is not None:
            model.optimizer.base_optimizer.load_state_dict(model.optimizer_state)

        if model.epoch is None:
            epochs_range = range(epochs)
        else:
            epochs_range = range(model.epoch + 1, epochs)

        if model.best_score is None:
            model.best_score = -1
        optimizer.last_acc = model.best_score

        for epoch in epochs_range:
            model.epoch = epoch
            Runner._run(
                'TRAIN', model, train_dataset, criterion, optimizer, train=True, **kwargs)

            score = Runner._run('EVAL', model, validation_dataset, train=False, **kwargs)

            optimizer.update_learning_rate(score, epoch + 1)
            model.optimizer_state = optimizer.base_optimizer.state_dict()

            new_best_found = False
            if score > model.best_score:
                print('* Best F1:', score)
                model.best_score = score
                new_best_found = True

                if best_save_path and new_best_found:
                    print('Saving best model...')
                    model.save_state(best_save_path)
                    print('Done.')

            if save_every_prefix is not None and (epoch + 1) % save_every_freq == 0:
                print('Saving epoch model...')
                save_path = '{prefix}_ep{epoch}.pth'.format(
                    prefix=save_every_prefix, epoch=epoch + 1)
                model.save_state(save_path)
                print('Done.')
            print('---------------------\n')

        print('Loading best model...')
        model.load_state(best_save_path)
        print('Training done.')

        return model.best_score

    def eval(model, dataset, **kwargs):
        return Runner._run('TEST', model, dataset, return_predictions=True, **kwargs)

    def predict(model, dataset, **kwargs):
        return Runner._run('TEST', model, dataset, return_predictions=True, **kwargs)