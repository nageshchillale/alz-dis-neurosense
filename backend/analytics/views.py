from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import CognitiveTrend, DailyWellness
from .serializers import CognitiveTrendSerializer, DailyWellnessSerializer
from assessments.models import Assessment
import json

class CognitiveTrendViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CognitiveTrend.objects.all().order_by('date_recorded')
    serializer_class = CognitiveTrendSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # Allow filtering by patient ID if passed
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            return self.queryset.filter(patient_id=patient_id)
        return self.queryset

class DailyWellnessViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyWellness.objects.all().order_by('-date')
    serializer_class = DailyWellnessSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DashboardAnalyticsView(views.APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, *args, **kwargs):
        patient_id = request.query_params.get('patient')
        
        # Query assessments
        query = Assessment.objects.select_related('patient').order_by('date_taken')
        if patient_id:
            query = query.filter(patient_id=patient_id)
            
        assessments = query.all()
        
        # Build trend data for Area Chart (averaging by month, dummy implementation groups by ID sequence)
        trends = []
        for a in assessments:
            month = a.date_taken.strftime("%b %d")
            trends.append({
                "month": month,
                "memory": a.memory_score,
                "attention": a.attention_score,
                "orientation": a.orientation_score,
                "overall": a.overall_score
            })
            
        # Get latest assessment for radar and metrics
        latest = None
        if assessments.exists():
            last = assessments.last()
            latest = {
                "id": last.id,
                "risk_level": last.risk_level,
                "memory_score": last.memory_score,
                "attention_score": last.attention_score,
                "orientation_score": last.orientation_score,
                "overall_score": last.overall_score,
                "date_taken": last.date_taken.strftime("%Y-%m-%d %H:%M")
            }
            
        return Response({
            "trends": trends,
            "latest_assessment": latest,
            "total_assessments": assessments.count()
        })
