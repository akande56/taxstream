from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group
from rest_framework import permissions


class IsUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user



class IsSupervisor1(BasePermission):
    """
    Custom permission class to check if a user belongs to the "supervisor1" group.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='supervisor1').exists()

class IsSupervisor2(BasePermission):
    """
    Custom permission class to check if a user belongs to the "supervisor2" group.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='supervisor2').exists()

class IsWardMonitor(BasePermission):
    """
    Custom permission class to check if a user belongs to the "ward_monitor" group.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='ward_monitor').exists()

class IsTaxCollector(BasePermission):
    """
    Custom permission class to check if a user belongs to the "tax_collector" group.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='tax_collector').exists()


class IsAuditOfficer(BasePermission):
    """
    Custom permission class to check if a user belongs to the "audit_officer" group.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='audit_officer').exists()


class IsAuditor_or_IsAssessor(BasePermission):
    """
    Custom permission class to check if a user belongs to either "Auditor officer" or "Assessment officer" group.
    """

    def has_permission(self, request, view):
        return request.user.groups.filter(name='audit_officer').exists() or request.user.groups.filter(name='assessment_officer').exists()