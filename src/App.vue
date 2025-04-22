<template>
  <div id="app">
    <Header v-if="showHeader" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<script>
import Header from './components/header/Header.vue';
import Footer from './components/Footer/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      showHeader: true,
      showFooter: true,
    };
  },
  created() {
    this.showHeader = this.$route.path !== '/reg';
    this.showFooter = this.$route.path !== '/reg';
  },
  methods: {
    loadChatWidget() {
    
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userEmail = localStorage.getItem('userEmail');
      const currentUser = users.find(user => user.email === userEmail) || {};

   
      window.juswidgetVariables = {
        start: {
          id: currentUser.id || 'guest',
          name: currentUser.name || 'Гость',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
        },
      };

     
      const script = document.createElement('script');
      script.src =
        'https://bot.jaicp.com/chatwidget/IPbHKtEw:597197a5683714ccdc4cbcb195b17b984aab1eb1/justwidget.js?force=true';
      script.async = true;

 


      script.onload = () => {
        console.log('Чат-виджет успешно загружен');
      };

   
      script.onerror = () => {
        console.error('Ошибка загрузки чат-виджета');
      };

      document.head.appendChild(script);
    },
  },
  mounted() {
    this.loadChatWidget();
  },
};
</script>

<style>

.jus-widget-container {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.jus-widget-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.jus-widget-message {
  padding: 10px;
  font-size: 14px;
}

.jus-widget-button {
  position: fixed;
  bottom: 120px; 
  margin-left: 20%;
  z-index: 1000; 
}
body {
    display: block;
    margin: 0px;
}
</style>