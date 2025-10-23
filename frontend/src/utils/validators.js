// Vérification de la validité de l'email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Vérification de la complexité du mot de passe
export const validatePassword = (password) => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Vérification si email déjà existant dans Strapi
// export const checkEmailExists = async (email) => {
//   try {
//     const res = await fetch(`http://localhost:1337/api/users?filters[email][$eq]=${email}`);
//     const users = await res.json();
//     return users.length > 0; // si au moins un user correspond, email déjà pris
//   } catch (error) {
//     console.error("Email check failed :", error);
//     return false;
//   }
// };

export const checkEmailExists = async (email) => {
  try {
    const res = await fetch(`http://localhost:1337/api/users?filters[email][$eq]=${email}`);
    const data = await res.json();

    // Strapi v4 renvoie { data: [...] }
    return Array.isArray(data) 
      ? data.length > 0 
      : Array.isArray(data.data) && data.data.length > 0;
  } catch (error) {
    console.error("❌ Email check failed :", error);
    return false;
  }
};
