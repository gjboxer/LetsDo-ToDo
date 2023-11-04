from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
from datetime import datetime


class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def profile(self):
        profile = Profile.objects.get(user=self)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)


class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False, blank=True, null=True)
    due_date = models.DateTimeField(blank=True, default=datetime.now, null=True)
    priority = models.CharField(max_length=20, default="medium", blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title