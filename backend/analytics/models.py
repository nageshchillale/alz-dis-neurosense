from django.db import models
from users.models import PatientProfile

class DailyWellness(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='wellness_logs')
    date = models.DateField(auto_now_add=True)
    sleep_hours = models.FloatField(null=True, blank=True)
    mood_score = models.IntegerField(null=True, blank=True)
    activity_level = models.CharField(max_length=50, null=True, blank=True)
    recommendation = models.TextField(help_text="AI-generated recommendation based on metrics")

class CognitiveTrend(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='trends')
    date_recorded = models.DateField(auto_now_add=True)
    rolling_memory_average = models.FloatField()
    rolling_attention_average = models.FloatField()
    risk_velocity = models.FloatField(help_text="Rate of change in cognitive score over time")
