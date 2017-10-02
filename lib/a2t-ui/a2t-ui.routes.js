"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var angular2_token_service_1 = require("../angular2-token.service");
var a2t_ui_component_1 = require("./a2t-ui.component");
var a2t_sign_in_component_1 = require("./a2t-sign-in/a2t-sign-in.component");
var a2t_sign_up_component_1 = require("./a2t-sign-up/a2t-sign-up.component");
var a2t_reset_password_component_1 = require("./a2t-reset-password/a2t-reset-password.component");
var a2t_update_password_component_1 = require("./a2t-update-password/a2t-update-password.component");
var routes = [{
        path: 'session',
        component: a2t_ui_component_1.A2tUiComponent,
        children: [
            { path: 'sign-in', component: a2t_sign_in_component_1.A2tSignInComponent },
            { path: 'sign-up', component: a2t_sign_up_component_1.A2tSignUpComponent },
            { path: 'reset-password', component: a2t_reset_password_component_1.A2tResetPasswordComponent },
            {
                path: 'update-password',
                component: a2t_update_password_component_1.A2tUpdatePasswordComponent,
                canActivate: [angular2_token_service_1.Angular2TokenService]
            }
        ]
    }];
exports.a2tRoutes = router_1.RouterModule.forChild(routes);
//# sourceMappingURL=a2t-ui.routes.js.map