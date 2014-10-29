<?php include __DIR__.'/inc/header.php'; ?>
<div class="registration_wapper">
    <h1 id="success_registration_heading_text">Registration complete</h1>
    <p id="success_registration_text">
        Wellcome, registration complete.<br/>
        You can <a href="<?=action('LoginController@login'); ?>">login</a>
        now.
    </p>
    
    
</div>




<?php include __DIR__.'/inc/footer.php';