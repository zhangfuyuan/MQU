import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/home'
  },
	{
    name: 'home',
    component: () => import('./views/home'),
    meta: {
      title: 'MQU'
    }
	},
  {
    name: 'multimedia',
    component: () => import('./views/multimedia'),
    meta: {
      title: 'multimedia.title'
    }
  },
  {
    name: 'quick-upload',
    component: () => import('./views/quickUpload'),
    meta: {
      title: 'quickUpload.title'
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ 
	scrollBehavior: () => ({ y: 0 }),
	routes 
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
