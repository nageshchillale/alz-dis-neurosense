from rest_framework import viewsets, generics, permissions
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    User endpoint to view profiles.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # Permission in settings is IsAuthenticated, which applies here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
