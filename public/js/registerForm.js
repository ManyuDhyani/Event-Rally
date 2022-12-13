(function ($) {
    var $form = $('#registration-form'),
    newUsernameInput = $('#username'),
    newEmailInput = $('#email'),
    newAgeInput = $('#age'),
    newPasswordInput = $('#passowrd')

    $form.on('submit', handleRegisteration);

    function handleRegisteration (e) {
        e.preventDefault();

        var newUsername = newUsernameInput.val();
        var newEmail = newEmailInput.val();
        var newAge = newAgeInput.val();
        var newPassword = newPasswordInput.val();

        var newContent = $('#new-content');

        if (newUsername && newEmail && newAge && newPassword) {
            var userJson = false;
            if (userJson) {
                var requestConfig = {
                    method: $form.attr('method'),
                    url: $form.attr('action'),
                    contentType: 'application/json',
                    data: JSON.stringify({
                        username: newUsername,
                        email: newEmail,
                        age: newAge,
                        password: newPassword,
                    })
                };

                $.ajax(requestConfig).then(function (responseMessage) {
                    console.log(responseMessage);
                    newContent.html(responseMessage.message);
                });
            }
        }
    }
})