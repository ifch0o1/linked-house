<?php include __DIR__.'/inc/header.php' ?>
<div class="registration_wapper">
    <h1 id="registration_heading_text">Registration</h1>
    <form method="POST">
        <table>
            <tr>
                <td>Username</td>
                <td><input type="text" name="username"/></td>
            </tr>
            <tr>
                <td>
                    Password
                </td>
                <td><input type="password" name="password" /></td>
            </tr>
            <tr>
                <td>
                    Re-enter password
                </td>
                <td><input type="password" name="password_confirm" /></td>
            </tr>
            <tr>
                <td>
                    Email address
                </td>
                <td><input type="text" name="email" /></td>
            </tr>
        </table>
        <input type='submit' value="Register" />
    </form>
</div>
<?php include __DIR__.'/inc/footer.php'; ?>