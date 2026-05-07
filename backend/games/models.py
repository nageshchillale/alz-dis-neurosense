from django.db import models
from users.models import PatientProfile

class GameSession(models.Model):
    class GameType(models.TextChoices):
        MEMORY_MATCH = 'MEMORY_MATCH', 'Memory Match'
        SPATIAL_REASONING = 'SPATIAL_REASONING', 'Spatial Reasoning'
        PATTERN_SEQUENCE = 'PATTERN_SEQUENCE', 'Pattern Sequence'

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='game_sessions')
    game_type = models.CharField(max_length=50, choices=GameType.choices)
    score = models.IntegerField()
    duration_seconds = models.IntegerField()
    played_at = models.DateTimeField(auto_now_add=True)
    metrics = models.JSONField(help_text="Detailed gameplay metrics (clicks, errors, etc.)")
