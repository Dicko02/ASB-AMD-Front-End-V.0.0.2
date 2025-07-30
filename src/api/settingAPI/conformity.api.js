import axios from 'axios';

//Appelle l'API pour la mise a jour d'un admin
async function updateConformityTable ({ adminId, selectedValues }) {
  return axios.put('http://localhost:5000/api/conformitySetting', {
    adminId,
    conformityToCheck: selectedValues
  });
};

export default updateConformityTable;