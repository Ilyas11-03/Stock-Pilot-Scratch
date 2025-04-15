import React from 'react';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Mot de passe oublié</h2>
        <form className="mt-6" action="#" method="POST">
          <div className="flex flex-col">
            <label className="block mb-2" htmlFor="email">
              Adresse e-mail
            </label>
            <input
              className="block w-full px-4 py-2 mb-3 text-gray-700 bg-gray-200 border rounded-md focus:outline-none focus:bg-white"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>

          <button
            className="w-full px-4 py-2 mt-4 mb-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};
