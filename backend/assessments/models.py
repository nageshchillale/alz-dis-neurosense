from django.db import models
from users.models import PatientProfile

class Assessment(models.Model):
    class RiskLevel(models.TextChoices):
        LOW = 'LOW', 'Low Risk'
        MODERATE = 'MODERATE', 'Moderate Risk'
        HIGH = 'HIGH', 'High Risk'

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='assessments')
    date_taken = models.DateTimeField(auto_now_add=True)
    overall_score = models.IntegerField()
    memory_score = models.IntegerField()
    attention_score = models.IntegerField()
    orientation_score = models.IntegerField()
    risk_level = models.CharField(max_length=20, choices=RiskLevel.choices)
    
class Question(models.Model):
    class Category(models.TextChoices):
        MEMORY = 'MEMORY', 'Memory'
        PATTERN = 'PATTERN', 'Pattern'
        ORIENTATION = 'ORIENTATION', 'Orientation'

    text = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    correct_answer = models.CharField(max_length=255)
    options = models.JSONField(help_text="Provide a list of options as JSON")
