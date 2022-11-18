import Vue from 'vue'
import VueRouter from 'vue-router'

import Users   from '../views/manage_users.vue'  ;
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import Verify from '../views/Verify.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '*',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/verify',
    name: 'Verify',
    component: Verify
  },
  {
    path: '/manage_users',
    name: 'Users',
    component: Users
  },
  {
    path: '/manage_pet',
    name: 'pet',
    component: () => import('../views/manage_pet.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
