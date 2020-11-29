from django.db import models

# Create your models here.
class EmailModel(models.Model):
    email = models.CharField(max_length=255)
    name = models.CharField(max_length=255, default='')
    zip = models.CharField(max_length=5,default='')
    phoneNumber = models.CharField(max_length=15,default='')

class Subscription(models.Model):
    email = models.CharField(max_length=255)

class dark_net_data(models.Model):
    email = models.CharField(max_length=255, default='none')
    name = models.CharField(max_length=255, default='none')
    birthday = models.CharField(max_length=255, default='none')
    currentTown = models.CharField(max_length=255, default='none')
    gender = models.CharField(max_length=255, default='none')
    relationshipStatus = models.CharField(max_length=255, default='none')
    address = models.CharField(max_length=255, default='none')
    phoneNumber = models.CharField(max_length=255, default='none')
    hometown = models.CharField(max_length=255, default='none')
    jobDetails = models.CharField(max_length=255, default='none')
    interests = models.CharField(max_length=255, default='none')
    politicalViews = models.CharField(max_length=255, default='none')
    religiousViews = models.CharField(max_length=255, default='none')