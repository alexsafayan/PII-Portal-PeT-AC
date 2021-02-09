from django.db import models

# Create your models here.
class EmailModel(models.Model):
    email = models.CharField(max_length=255, default = 'none')
    password = models.CharField(max_length=255, default = 'none')
    name = models.CharField(max_length=255, default = 'none')
    zip = models.CharField(max_length=255, default = 'none')
    phoneNum = models.CharField(max_length=15, default = 'none')
    address = models.CharField(max_length=255, default = 'none')
    ssn = models.CharField(max_length=255, default = 'none')
    birthday = models.CharField(max_length=255, default = 'none')
    hometown = models.CharField(max_length=255, default = 'none')
    currentTown = models.CharField(max_length=255, default = 'none')
    jobDetails = models.CharField(max_length=255, default = 'none')
    relationshipStatus = models.CharField(max_length=255, default = 'none')
    interests = models.CharField(max_length=255, default = 'none')
    politicalViews = models.CharField(max_length=255, default = 'none')
    religiousViews = models.CharField(max_length=255, default = 'none')
    platform = models.CharField(max_length=255, default = 'none')
    dateCollected = models.CharField(max_length=255, default = 'none')

class Subscription(models.Model):
    email = models.CharField(max_length=255)

