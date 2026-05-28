<?php
$host = "localhost";
$usuario = "root"; // Se estiver num servidor web real, mude para o seu utilizador do banco
$senha = "";       // Se estiver num servidor web real, mude para a sua senha do banco
$banco = "yahweh_db";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na ligação: " . $conn->connect_error);
}
?>
