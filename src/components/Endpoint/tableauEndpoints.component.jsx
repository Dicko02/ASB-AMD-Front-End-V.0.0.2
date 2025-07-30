import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';// Composants de thème Material-UI
import Stack from '@mui/material/Stack';// Composants de mise en page
import Loading from '../Complements/Loading.component';
import fetchEndpoints from '../../api/endpoint/allEndpoints.api';// Importation de l'API personnalisée pour récupérer les endpoints
import { useNavigate } from 'react-router-dom';// importation du hook useNavigate pour la navigation entre les pages
import exporteCSV from '../../utils/Export/ExportCSV';
import {exportePDFListeEndpoints} from '../../utils/Export/ExportPDF';
// Composants de DataGrid
import {
  DataGrid,
  GridToolbar, 
} from '@mui/x-data-grid';

function EndpointsList() {
  const navigate = useNavigate();// Hook pour la navigation entre les pages
  
  const [endpoints, setEndpoints] = React.useState([]);// État pour stocker les endpoints récupérés depuis l'API
  const [loading, setLoading] = React.useState(true);

  // Chargement des endpoints à l’affichage initial du composant
  React.useEffect(() => {
    async function chargerEndpoints() {
      try {
        const response = await fetchEndpoints();
        setEndpoints(response.data); // Met à jour l’état avec les données reçues
      } catch (error) {
        console.error("Erreur lors du chargement des endpoints : ", error);
      }finally {
        setLoading(false);
      }
    }

    chargerEndpoints();
  }, 
  
  []/* 👈 Dépendances vides pour charger une seule fois */ );

  // Définition des colonnes à afficher dans le tableau
  const columns = [
    {
        field: 'CN',
        headerName: 'Nom de l\'endpoints',
        width: 250,
        cellClassName: 'cell-center',
    },

    {
        field: 'Utilisateur',
        headerName: 'Nom de l\'utilisateur',
        width: 200,
        cellClassName: 'cell-center',
    },

    {
        field: 'Lieu',
        headerName: 'Lieu',
        width: 200,
        cellClassName: 'cell-center',
    },

    {
        field: 'dangerousityNumber',
        headerName: 'Numéro de dangerosité',
        width: 180,
        cellClassName: 'cell-center',
    },

    {
      field: 'criticalLevel',
      headerName: 'Niveau de dangerosité',
      width: 180,
      cellClassName: 'cell-center',
      renderCell: (params) => {
        const criticalLevel = params.row?.criticalLevel?.toLowerCase();
        let color;

        switch (criticalLevel) {
          case "low":
            color = "green";
            break;
          case "medium":
            color = "yellow";
            break;
          case "high":
            color = "orange";
            break;
          case "critical": // corriger "criticaly"
            color = "red";
            break;
          default:
            color = "white";
        }

        return (
          <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: color,
            lineHeight: "30px"
          }}>
            {/* {criticalLevel} */}
          </div>
        );
      }
    },

    {
      field: 'conformity',
      headerName: 'Conforme',
      width: 150,
      sortable: false,
      filterable: true,
      cellClassName: 'cell-center',
      renderCell: (params) => {
        const criticalLevel = params.row?.criticalLevel?.toLowerCase();
        if(criticalLevel === 'low'){
          return (<p>Oui</p>)
        }else{
          return (<p>Non</p>)
        }
      }
    },

    {
      field: 'description',
      headerName: 'Detail',
      width: 150,
      sortable: false,
      filterable: false,
      cellClassName: 'cell-center',
      renderCell: (params) => (
        <button onClick={() => viewDescription(params.row)} style={{ cursor: 'pointer', fontSize: '30px' }}> 👁️ </button>
      ),
    },

    {
      field: 'updatedAt',
      headerName: 'Mis à jour le',
      width: 200,
      cellClassName: 'cell-center',
      valueGetter: (params) => {
        
        const dateStr = params.row?.updatedAt;
        let date ;

        if (!dateStr) {
          date = new Date(); // Si la date n'est pas définie, utilise la date actuelle
        } else {
          date = new Date(dateStr); // Convertit la chaîne de caractères en objet Date
        };

        return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR');
      }
    }

  ];

  // Modèle de visibilité des colonnes pour contrôler quelles colonnes sont affichées
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    CN: true,
    Utilisateur: true,
    Lieu: true,
    dangerousityNumber: true,
    criticalLevel: true,
    description: true,
    updatedAt: true,
    conformity: true,
  });

  if (loading){
    return <Loading text="chargement de la liste des endpoints..." />;
  }

  // Création d’un thème pour l’interface
  const Theme = createTheme({
    palette: {
      //mode: 'dark', // 🌑 Mode sombre pour l’interface
      mode: 'light', // 🌓 Mode clair pour l’interface
    },
  });


  const viewDescription = (row) => {
    navigate(`/${row.CN}`);// Redirection vers /api/CN (par exemple /api/LP-KAMARA)
  };


  return (
    // Application du thème à toute l’interface
    <ThemeProvider theme={Theme}>
      <Stack
        spacing={2}
        style={{
          height: '80%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Tableau principal avec DataGrid */}
        <div
          style={{
            height: 450,
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Zone des boutons export */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
            }}
          >
            <button
              onClick={() => exporteCSV(endpoints, 'Liste des endpoints')}
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Export CSV
            </button>

            <button
              onClick={() => exportePDFListeEndpoints(endpoints, 'Liste des endpoints')}
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Export PDF
            </button>
          </div>

          <DataGrid
            rows={endpoints} // Données utilisateurs issues de l'API
            columns={columns} // Colonnes définies manuellement

            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }

            components={{ Toolbar: GridToolbar }} // Outils supplémentaires (filtre, export...)
            getRowId={(row) => row.CN}
            pageSizeOptions={[5, 10, 25, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            sx={{
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex', // important pour centrer horizontalement
                alignItems: 'center', // optionnel : centre verticalement
              },
              '& .MuiDataGrid-columnHeader': {
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </div>
      </Stack>
    </ThemeProvider>
  );

}

export default EndpointsList;
