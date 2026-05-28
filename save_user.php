<?php
include 'config.php';

// Ativar exibição de erros temporariamente para depuração
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['email'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $nome = $conn->real_escape_string($_POST['nome']);

    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    
    if ($check->num_rows == 0) {
        $sql = "INSERT INTO users (email, senha_hash) VALUES ('$email', 'GOOGLE_AUTH')";
        if ($conn->query($sql)) {
            $user_id = $conn->insert_id;
            $conn->query("INSERT INTO user_profiles (user_id, nome_completo) VALUES ($user_id, '$nome')");
            echo "Sucesso: Utilizador inserido.";
        } else {
            echo "Erro SQL: " . $conn->error;
        }
    } else {
        echo "Utilizador já existe.";
    }
} else {
    echo "Nenhum dado recebido pelo POST.";
}
?>
