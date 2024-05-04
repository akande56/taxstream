from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group
from django.contrib import admin

class MyGroupAdmin(GroupAdmin):
    list_display = ('name', 'users')

admin.site.register(Group, MyGroupAdmin)
