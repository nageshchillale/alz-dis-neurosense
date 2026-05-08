from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import UserViewSet
from assessments.views import AssessmentViewSet, QuestionViewSet
from analytics.views import (
    CognitiveTrendViewSet,
    DailyWellnessViewSet,
    DashboardAnalyticsView
)

# =========================
# ROUTERS
# =========================

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'assessments', AssessmentViewSet, basename='assessments')
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'trends', CognitiveTrendViewSet, basename='trends')
router.register(r'wellness', DailyWellnessViewSet, basename='wellness')


# =========================
# URL PATTERNS
# =========================

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Routes
    path('api/', include(router.urls)),

    # Authentication Routes
    path('api/auth/', include('users.urls')),

    # Dashboard Analytics
    path(
        'api/dashboard-analytics/',
        DashboardAnalyticsView.as_view(),
        name='dashboard_analytics'
    ),
]