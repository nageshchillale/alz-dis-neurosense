from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = 'PATIENT', 'Patient'
        CAREGIVER = 'CAREGIVER', 'Caregiver'
        ADMIN = 'ADMIN', 'Admin'
    
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.PATIENT)
    
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    baseline_score = models.IntegerField(null=True, blank=True)
    
class CaregiverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='caregiver_profile')
    patients = models.ManyToManyField(PatientProfile, related_name='caregivers')
    phone = models.CharField(max_length=20, null=True, blank=True)
