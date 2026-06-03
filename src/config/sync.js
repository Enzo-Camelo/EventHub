import sequelize from './database.js';
import './associations.js';

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true });
    
    console.log('✅ Banco de dados sincronizado com sucesso! As tabelas foram criadas/atualizadas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase();
