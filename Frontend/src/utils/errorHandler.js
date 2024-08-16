export const handleError = error => {
  let errorMessage = 'An unknown error occurred';

  if (error.response) {
    const {message, errors} = error.response.data;

    if (errors && Array.isArray(errors)) {
      // Construire un message d'erreur détaillé à partir des erreurs de validation
      errorMessage = errors
        .map(err => `${err.field}: ${err.message}`)
        .join('\n');
    } else if (message) {
      // Utiliser le message général si aucun détail d'erreur n'est fourni
      errorMessage = message;
    }
  } else if (error.message) {
    // Erreurs capturées par le client (ex: problème de réseau)
    errorMessage = error.message;
  }

  console.error('Error:', errorMessage);
  return errorMessage;
};
