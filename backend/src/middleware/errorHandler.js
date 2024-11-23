export const errorHandler = (err, req, res, next) => {
     console.error(err.stack);

     if (err.type === 'validation') {
          return res.status(400).json({
               error: 'Erro de validação',
               details: err.message
          });
     }

     res.status(500).json({
          error: 'Erro interno do servidor',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
     });
};