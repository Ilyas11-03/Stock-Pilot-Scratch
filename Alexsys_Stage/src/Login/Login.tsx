import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useNavigate} from 'react-router-dom';
import { login as apiLogin } from '../Login/core/_requets'; // Importez la fonction de connexion
import stockpilot from '../assets/Stock-Pilot2.jpg'; // Remplacez par le chemin de votre image
import backgroundImage from "../assets/que_es_gestion_stock_importancia.png"

const Login: React.FC = () => {

  const navigate = useNavigate();
  // const login = useAuth()

  // Schéma de validation avec Yup
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Le nom d\'utilisateur est requis'),
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .required('Le mot de passe est requis'),
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: { username: string; password: string }) => {

    try {
      // Appel à l'API de connexion
      const response = await apiLogin(values.username, values.password);
      // Enregistrer le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      // Enregistrer l'id du client dans le localStorage qui sera généré lors de 
      localStorage.setItem('clientId', response.data.client.id.toString());

      console.log("Token :", response.data.token);
      console.log("ClientId :", response.data.client.id)

      navigate('/dashboard');
      console.log('Login successful');

    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la connexion.',
      });
    }
  };

  return (
    
    <section className="flex flex-col md:flex-row h-screen items-center">
      {/* Section de l'image */}
      <div className="hidden lg:block w-full md:w-20 xl:w-2/3 h-screen animate-bounce-up-down">
      
        <img
          src={backgroundImage} // Remplacez par votre image
          className="w-full h-full object-contain"
          alt="StockPilot"
        />
      </div>

      {/* Section du formulaire */}
      <div className="bg-gray-100 w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <img src={stockpilot}className='mx-auto w-30 object-contain'/>
          <h1 className="text-xl text-center md:text-2xl font-bold leading-tight mt-12">
            Bienvenue sur StockPilot
          </h1>
          <h1 className="text-lg text-center md:text-2xl font-serif leading-tight">Connectez-vous</h1>

          {/* Formulaire avec Formik */}
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6">
                <div>
                  <label className="block text-gray-700 font-bold text-lg">Nom d'utilisateur</label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Entrez votre nom d'utilisateur"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <hr className="my-6 border-gray-300 w-full" />
                <div className="mt-4">
                  <label className="block text-gray-700 font-bold text-lg">Mot de passe</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* <div className="text-right mt-2">
                  <Link to="/login/forgot-password" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">
                    Mot de passe oublié ?
                  </Link>
                </div> */}
                <hr className="my-6 border-gray-300 w-full" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full block bg-red-600 hover:bg-red-700 focus:bg-red-800 text-white font-semibold rounded-full px-4 py-3 mt-6 cursor-pointer button-animation"
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default Login;