// /utils/validator.js

/**
 * Valida que el campo no esté vacío
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `El campo ${fieldName} es obligatorio`;
  }
  return null;
};

/**
 * Valida el nombre y apellido (solo letras, espacios y mínimo 2 caracteres, máximo 100)
 */
export const validateName = (value, fieldName) => {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;

  const nameRegex = /^[a-zA-ZáéíóúñÑüÜ\s]{2,100}$/;
  if (!nameRegex.test(value.trim())) {
    return `${fieldName} debe contener solo letras y tener entre 2 y 100 caracteres`;
  }
  return null;
};

/**
 * Valida el email
 */
export const validateEmail = (value) => {
  const requiredError = validateRequired(value, 'Correo electrónico');
  if (requiredError) return requiredError;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value.trim())) {
    return 'Ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)';
  }
  return null;
};

/**
 * Valida la contraseña
 * Requisitos: mínimo 6 caracteres, máximo 255
 */
export const validatePassword = (value) => {
  const requiredError = validateRequired(value, 'Contraseña');
  if (requiredError) return requiredError;

  if (value.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (value.length > 255) {
    return 'La contraseña no puede tener más de 255 caracteres';
  }
  return null;
};

/**
 * Valida el archivo de imagen
 * Máximo 5MB, solo imágenes
 */
export const validateImageFile = (file) => {
  if (!file) return null;
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)';
  }
  
  if (file.size > maxSize) {
    return 'La imagen no puede superar los 5MB';
  }
  
  return null;
};

/**
 * Valida el formulario de registro
 */
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  errors.nombre = validateName(formData.nombre, 'Nombre');
  errors.apellido = validateName(formData.apellido, 'Apellido');
  errors.correo = validateEmail(formData.correo);
  errors.password = validatePassword(formData.password);
  
  return errors;
};

/**
 * Valida el formulario de perfil (edición)
 */
export const validateProfileForm = (perfilData) => {
  const errors = {};
  
  errors.nombre = validateName(perfilData.nombre, 'Nombre');
  errors.apellido = validateName(perfilData.apellido, 'Apellido');
  errors.correo = validateEmail(perfilData.correo);
  
  return errors;
};

/**
 * Valida el producto
 */
export const validateProducto = ({ nombre_producto, precio, stock, id_categoria }, isAdd, hasFile) => {
  const errors = {};

  // Nombre del producto
  if (!nombre_producto?.trim()) {
    errors.nombre_producto = 'El nombre del producto es obligatorio.';
  } else if (nombre_producto.trim().length < 3) {
    errors.nombre_producto = 'El nombre debe tener al menos 3 caracteres.';
  } else if (nombre_producto.trim().length > 150) {
    errors.nombre_producto = 'El nombre no puede superar 150 caracteres.';
  }

  // Imagen (solo obligatoria al crear)
  if (isAdd && !hasFile) {
    errors.imagen = 'La imagen del producto es obligatoria.';
  }

  // Precio
  if (!precio && precio !== 0) {
    errors.precio = 'El precio es obligatorio.';
  } else if (isNaN(precio) || Number(precio) <= 0) {
    errors.precio = 'El precio debe ser un número mayor a 0.';
  } else if (Number(precio) > 99999.99) {
    errors.precio = 'El precio no puede superar S/ 99,999.99.';
  }

  // Stock
  if (!stock && stock !== 0) {
    errors.stock = 'El stock es obligatorio.';
  } else if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a 0.';
  }

  // Categoría
  if (!id_categoria) {
    errors.id_categoria = 'La categoría es obligatoria.';
  } else if (isNaN(id_categoria) || Number(id_categoria) < 1) {
    errors.id_categoria = 'Selecciona una categoría válida.';
  }

  return errors;
};

/**
 * Valida usuario administrador
 */
export const validateUsuarioAdmin = ({ nombre, apellido, correo, password }, isAdd) => {
  const errors = {};

  // Nombre
  if (!nombre?.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
    errors.nombre = 'El nombre solo puede contener letras.';
  }

  // Apellido
  if (!apellido?.trim()) {
    errors.apellido = 'El apellido es obligatorio.';
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
    errors.apellido = 'El apellido solo puede contener letras.';
  }

  // Correo
  if (!correo?.trim()) {
    errors.correo = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errors.correo = 'Ingresa un correo válido.';
  }

  // Contraseña (solo al crear)
  if (isAdd) {
    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 8) {
      errors.password = 'Mínimo 8 caracteres.';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Debe tener al menos una mayúscula.';
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Debe tener al menos un número.';
    }
  }

  return errors;
};

/**
 * Valida el stock de un producto
 */
export const validateStock = (cantidad, stockDisponible, nombreProducto) => {
  if (cantidad <= 0) {
    return `La cantidad de "${nombreProducto}" debe ser mayor a 0`;
  }
  if (cantidad > stockDisponible) {
    return `No hay suficiente stock de "${nombreProducto}". Disponible: ${stockDisponible}`;
  }
  return null;
};

/**
 * Valida el carrito antes de proceder al checkout
 */
export const validateCartBeforeCheckout = (items) => {
  const errors = [];
  
  if (!items || items.length === 0) {
    errors.push('El carrito está vacío. Agrega productos para continuar.');
    return errors;
  }
  
  items.forEach((item, index) => {
    if (!item.id_producto) {
      errors.push(`Producto #${index + 1}: ID de producto inválido`);
    }
    if (!item.cantidad || item.cantidad <= 0) {
      errors.push(`${item.nombre_producto || `Producto #${index + 1}`}: Cantidad inválida`);
    }
    if (!item.precio || item.precio <= 0) {
      errors.push(`${item.nombre_producto || `Producto #${index + 1}`}: Precio inválido`);
    }
  });
  
  return errors;
};

/**
 * Valida el formulario de login
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  errors.correo = validateEmail(formData.correo);
  errors.password = validateRequired(formData.password, 'Contraseña');
  
  return errors;
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Opcional: Verificar si el token está expirado
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};