from django.contrib import admin

# from django.contrib.auth.admin import UserAdmin
from .models import (
    User,
    LGA,
    State,
    Ward, 
    WardAndMonitor,
    BlacklistedToken
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