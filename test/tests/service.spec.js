const serviceLayer = require('../../src/services/service');

describe('Pruebas Unitarias - Capa de Servicio (100% Branch Coverage)', () => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    it('Debe procesar correctamente cuando body llega como OBJETO', async () => {
        const eventObjeto = {
            body: {
                key: "onboardingTest",
                region: "C001"
            }
        };

        console.log("--- Test 1: Body Objeto ---");
        const respuesta = await serviceLayer.service(eventObjeto);

        expect(respuesta).toBeDefined();
        expect(respuesta.key).toBe('onboardingTest');
    });

    it('Debe procesar (parsear) correctamente cuando body llega como STRING', async () => {
        const eventString = {
            body: JSON.stringify({
                key: "onboardingTest",
                region: "C001"
            })
        };



        console.log("--- Test 2: Body String ---");
        const respuesta = await serviceLayer.service(eventString);

        expect(respuesta).toBeDefined();
        expect(respuesta.key).toBe('onboardingTest');
    });

    it('Debe capturar el error si el body es un JSON inválido', async () => {
        const eventMalo = {
            body: "{ json roto: sin cerrar corchetes"
        };

        console.log("--- Test 3: Forzando Error ---");

        try {
            await serviceLayer.service(eventMalo);
            fail("El servicio debió fallar y no lo hizo");
        } catch (error) {
            console.log("Error capturado:", error);
            expect(error).toBeDefined();

            if (error.output) {
                expect(error.success).toBe(500);
            }
        }
    });

    it('Debe lanzar un error de "Dato no encontrado" cuando no hay resultados', async () => {
        const eventNotFound = {
            body: {
                key: "ESTE_ID_NO_EXISTE",
                region: "C001"
            }
        };

        try {
            await serviceLayer.service(eventNotFound);
            fail("El servicio debió fallar por dato no encontrado");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.output.ResponseMessage.ResponseHeader.Status.StatusCode).toBe('20-08A');
        }
    });

});