from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from assessments.views import AssessmentViewSet, QuestionViewSet
from analytics.views import CognitiveTrendViewSet, DailyWellnessViewSet, DashboardAnalyticsView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'trends', CognitiveTrendViewSet)
router.register(r'wellness', DailyWellnessViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/dashboard-analytics/', DashboardAnalyticsView.as_view(), name='dashboard_analytics'),
]
