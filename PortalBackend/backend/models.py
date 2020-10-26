from django.db import models

# Create your models here.
class EmailModel(models.Model):
    email = models.CharField(max_length=255)
    name = models.CharField(max_length=255, default='')
    zip = models.CharField(max_length=5,default='')
    phoneNumber = models.CharField(max_length=15,default='')
