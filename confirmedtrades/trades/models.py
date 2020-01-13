from django.db import models
from datetime import datetime
import pytz

class Redditor(models.Model):
    username = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.username


class Trade(models.Model):
    user1 = models.ForeignKey(Redditor, related_name='trades1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(Redditor, related_name='trades2', on_delete=models.CASCADE)
    comment_id = models.CharField(max_length=7)
    comment_url = models.CharField(max_length=200)
    confirmation_datetime = models.DateTimeField(default=datetime(1970, 1, 1, 0, 0, 0, tzinfo=pytz.UTC))
