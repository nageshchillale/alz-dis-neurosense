from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Assessment, Question
from .serializers import AssessmentSerializer, QuestionSerializer
from users.models import PatientProfile

class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API to fetch questions for the frontend assessment flow.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AssessmentViewSet(viewsets.ModelViewSet):
    """
    API to submit assessments and calculate risk.
    """
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Using IsAuthenticatedOrReadOnly to allow testing without login barrier if needed

    def create(self, request, *args, **kwargs):
        data = request.data
        
        # 1. Parse incoming data
        memory_score = int(data.get('memory_score', 0))
        attention_score = int(data.get('attention_score', 0))
        orientation_score = int(data.get('orientation_score', 0))
        
        # Dummy test mechanism: if no patient ID is passed, create or use a dummy patient
        patient_id = data.get('patient')
        if not patient_id:
            # Get first patient profile or return 400
            try:
                patient = PatientProfile.objects.first()
            except PatientProfile.DoesNotExist:
                return Response({"error": "No patient profiles exist in DB setup dummy patient."}, status=400)
        else:
            patient = PatientProfile.objects.get(id=patient_id)
        
        # 2. Risk Calculation Logic
        overall_score = (memory_score + attention_score + orientation_score) / 3
        
        if overall_score >= 85:
            risk_level = Assessment.RiskLevel.LOW
        elif 60 <= overall_score < 85:
            risk_level = Assessment.RiskLevel.MODERATE
        else:
            risk_level = Assessment.RiskLevel.HIGH
            
        # 3. Save the assessment
        assessment = Assessment.objects.create(
            patient=patient,
            memory_score=memory_score,
            attention_score=attention_score,
            orientation_score=orientation_score,
            overall_score=overall_score,
            risk_level=risk_level
        )
        
        serializer = self.get_serializer(assessment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
