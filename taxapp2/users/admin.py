from django.contrib import admin
from django.contrib.auth.models import Group
# from django.contrib.auth.admin import UserAdmin
from .models import (
    User,
    LGA,
    State,
    Ward, 
    WardAndMonitor,
    BlacklistedToken,
    )


# @admin.register(User)
# class UserAdmin(UserAdmin):
#     pass

@admin.register(User)
class Admin(admin.ModelAdmin):
    '''Admin View for '''

    list_display = ('username','email','first_name','staff_role','pk')
    

admin.site.register(LGA)



admin.site.register(Ward)

admin.site.register(State)


admin.site.register(WardAndMonitor)

admin.site.register(BlacklistedToken)


class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_users']

    def get_users(self, obj):
        return ", ".join([user.username for user in obj.user_set.all()])
    get_users.short_description = 'Users'
# class GroupAdmin(admin.ModelAdmin):
#     list_display = ['name', 'user_dropdown']

#     def user_dropdown(self, obj):
#         return render_to_string('admin/group_dropdown.html', {'group': obj})
#     user_dropdown.short_description = 'Users'

# {% load i18n %}
# <select>
#     {% for user in group.user_set.all %}
#         <option value="{{ user.pk }}">{{ user.username }}</option>
#     {% endfor %}
# </select>

admin.site.unregister(Group) 
admin.site.register(Group, GroupAdmin)  