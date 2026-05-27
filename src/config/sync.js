import sequelize from './database.js';

// Importa todos os models E registra as associações entre eles
import './associations.js';

async function syncDatabase() {
  try {
    // Tenta autenticar primeiro para garantir que as credenciais estão corretas
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    // Sincroniza os models com o banco de dados
    // alter: true -> altera as tabelas existentes para se adequarem aos models sem deletar os dados
    // force: true -> recria as tabelas do zero (cuidado: APAGA os dados!)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Banco de dados sincronizado com sucesso! As tabelas foram criadas/atualizadas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase();
