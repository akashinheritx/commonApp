    //validate reset password form
    $().ready(function() {
      $("#resetForm").validate({
        highlight: function(element) {
            $(element).closest('.form-groups').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-groups').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
          if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
          } else {
            error.insertAfter(element);
          }
        },
        rules: {
          new_password: {
            required: true,
            minlength: 6
          },
          confirmPassword: {
            required: true,
            minlength: 6,
            equalTo: "#password"
          },
        },
        messages: {
          new_password: {
            required: "Please enter Password",
            minlength: "Your password must contain at least 6 characters"
          },
          confirmPassword: {
            required: "Please enter Confirm Password",
            minlength: "Your password must contain at least 6 characters",
            equalTo: "Please enter password and confirm password values same"
          },
        },
        submitHandler: function(form) {
          form.submit();
        }
      })
    })