import SidebarToggle from '../components/Complements/SideBar.component';
import Header from '../components/Complements/Header.component';
import ConformitySettingCheckboxForm from '../components/Setting-Items/Conformity.component';
import AllDangerosityNumberSetting from '../components/Setting-Items/AllDangerosityNumber.component';
import CriticalLevelSetting from '../components/Setting-Items/CriticalLevelMaxValue.component';
import Footer from '../components/Complements/Footer.component';

function Setting() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <SidebarToggle />
      <main
        style={{
          padding: '1.5rem',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Header title="Paramètre" />
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap', // ✅ permet le passage à la ligne
            gap: '1.5rem', // ✅ espace entre les blocs
            paddingTop: '2rem',
          }}
        >
          <ConformitySettingCheckboxForm />
          <AllDangerosityNumberSetting />
          <CriticalLevelSetting />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Setting;
