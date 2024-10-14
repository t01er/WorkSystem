<?php 
include '../db/database.php';

$database = new Database();
$conn = $database->getConnection();

// Obtener los datos enviados desde JavaScript
$id_trabajador = $_POST['id_trabajador'];
$dni = $_POST['dni'];
$nombres = $_POST['nombres'];
$apellido_p = $_POST['apellido_p'];
$apellido_m = $_POST['apellido_m'];
$sexo = $_POST['sexo'];
$numero_cel = $_POST['numero_cel'];
$id_puesto = $_POST['id_puesto'];
$id_horario = $_POST['id_horario'];
$estado = $_POST['estado'];
$salario_por_dia = $_POST['salario_por_dia'];

// No manejar archivos subidos, simplemente usar una cadena vacía para files
$files = ''; // Se establece como vacío, ya que no se subirán archivos

try {
    // Preparar la declaración para el procedimiento almacenado
    $stmt = $conn->prepare("CALL actualizarTrabajador(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Pasar los parámetros al procedimiento almacenado
    $stmt->bind_param(
        'issssssisdi',  // Asegúrate de que esta cadena de tipos sea correcta
        $id_trabajador,
        $dni,
        $nombres,
        $apellido_p,
        $apellido_m,
        $sexo,
        $numero_cel,
        $files,  
        $id_puesto,
        $id_horario,
        $estado,
        $salario_por_dia
    );

    // Ejecutar el procedimiento
    $stmt->execute();

    // Comprobar si la ejecución fue exitosa
    if ($stmt->affected_rows > 0) {
        // Enviar un mensaje de éxito en formato JSON
        echo json_encode(['status' => 'success', 'message' => 'Trabajador actualizado con éxito']);
    } else {
        // Enviar un mensaje de error si no se actualizó ningún registro
        echo json_encode(['status' => 'error', 'message' => 'No se pudo actualizar el trabajador']);
    }

} catch (mysqli_sql_exception $e) {
    // Enviar un mensaje de error si ocurre una excepción
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el trabajador: ' . $e->getMessage()]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>
