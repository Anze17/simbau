<?php
// ==========================================
// SIMBAU - Email Form Handler
// ==========================================

header('Content-Type: application/json');

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metoda ni dovoljena']);
    exit;
}

// Configuration
$to_email = 'info@simbau.si'; // <-- VAŠ EMAIL
$from_name = 'SIMBAU Spletna Stran';
$subject_prefix = '[SIMBAU Kontakt]';

// Get and sanitize form data
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Prosimo vnesite veljavno ime';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Prosimo vnesite veljaven email naslov';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Sporočilo mora biti dolgo vsaj 10 znakov';
}

// If there are errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Build email subject
$subject = $subject_prefix . ' Novo sporočilo od ' . $name;

// Build email body
$email_body = "=================================\n";
$email_body .= "NOVO SPOROČILO IZ KONTAKTNEGA OBRAZCA\n";
$email_body .= "=================================\n\n";
$email_body .= "IME: $name\n";
$email_body .= "EMAIL: $email\n";
$email_body .= "TELEFON: " . (!empty($phone) ? $phone : 'Ni podano') . "\n\n";
$email_body .= "SPOROČILO:\n";
$email_body .= "-----------------------------------\n";
$email_body .= "$message\n";
$email_body .= "-----------------------------------\n\n";
$email_body .= "Poslano: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP naslov: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Email headers
$headers = "From: $from_name <$to_email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to_email, $subject, $email_body, $headers);

if ($mail_sent) {
    // Success - also send confirmation email to user
    $user_subject = 'Hvala za vaše sporočilo - SIMBAU';
    $user_message = "Spoštovani $name,\n\n";
    $user_message .= "Hvala za vaše sporočilo. Prejeli smo vašo zahtevo in vam bomo odgovorili v najkrajšem možnem času.\n\n";
    $user_message .= "Vaše sporočilo:\n";
    $user_message .= "-----------------------------------\n";
    $user_message .= "$message\n";
    $user_message .= "-----------------------------------\n\n";
    $user_message .= "Lep pozdrav,\n";
    $user_message .= "Ekipa SIMBAU\n\n";
    $user_message .= "---\n";
    $user_message .= "SIMBAU d.o.o.\n";
    $user_message .= "Telefon: +386 40 123 456\n";
    $user_message .= "Email: info@simbau.si\n";
    
    $user_headers = "From: $from_name <$to_email>\r\n";
    $user_headers .= "Reply-To: $to_email\r\n";
    $user_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $user_headers .= "MIME-Version: 1.0\r\n";
    $user_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    mail($email, $user_subject, $user_message, $user_headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Hvala! Vaše sporočilo je bilo uspešno poslano. Odgovorili vam bomo v najkrajšem možnem času.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Prišlo je do napake pri pošiljanju. Prosimo poskusite ponovno ali nas kontaktirajte direktno na info@simbau.si'
    ]);
}
?>