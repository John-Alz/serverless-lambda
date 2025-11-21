const businessLayer = require('../../src/business/business');
// Importamos el servicio para poder espiarlo
const serviceModule = require('../../src/services/service');

describe('Pruebas Unitarias - Capa de Negocio', () => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    it('Debe retornar data exitosa cuando el servicio responde bien', async () => {
        const event = { body: { key: "ok" } };

        spyOn(serviceModule, 'service').and.returnValue(Promise.resolve({
            key: "ok",
            mensaje: "exito"
        }));

        const respuesta = await businessLayer(event);
        expect(respuesta.mensaje).toBe("exito");
    });

    it('Debe capturar un error normal y envolverlo en formato 500', async () => {
        const event = { body: { key: "error" } };

        spyOn(serviceModule, 'service').and.returnValue(Promise.reject(new Error("Fallo de conexión")));

        try {
            await businessLayer(event);
            fail("Debió fallar y entrar al catch");
        } catch (error) {
            console.log("Error genérico capturado");
            expect(error.output).toBeDefined();
            if (error.output.statusCode) {
                expect(error.output.statusCode).toBe(500);
            }
        }
    });

    it('Debe relanzar el error tal cual si ya tiene formato Nequi.', async () => {
        const event = { body: { key: "errorNequi" } };

        const errorYaFormateado = {
            output: { statusCode: 400, body: "Bad Request" },
            message: "Error de validación"
        };

        spyOn(serviceModule, 'service').and.returnValue(Promise.reject(errorYaFormateado));

        try {
            await businessLayer(event);
            fail("Debió fallar");
        } catch (error) {
            console.log("Error Nequi capturado");
            expect(error).toBe(errorYaFormateado);
            expect(error.output.statusCode).toBe(400);
        }
    });
});