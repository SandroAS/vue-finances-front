<template>
  <v-container fill-height>
    <v-layout justify-center align-center>

      <v-flex xs12 sm6 md4 lg3 xl3>
        <v-card elevation="12">

          <v-toolbar color="primary" dark>
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isloading"
              indeterminate
              color="white"
              width="2"
            ></v-progress-circular>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <label v-if="!isLogin" for="name">Nome</label>
              <v-text-field
                v-if="!isLogin"
                v-model.trim="$v.user.name.$model"
                prepend-icon="person"
                name="name"
                type="text"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid"
              ></v-text-field>
              <label for="email">E-mail</label>
              <v-text-field
                v-model.trim="$v.user.email.$model"
                prepend-icon="email"
                name="email"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
              ></v-text-field>
              <label for="password">Senha</label>
              <v-text-field
                v-model.trim="$v.user.password.$model"
                prepend-icon="lock"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                loading
                @click:append="showPassword = !showPassword"
              >
                <template v-slot:progress>
                  <v-progress-linear
                    :value="progress"
                    :color="color"
                    absolute
                    height="1"
                  ></v-progress-linear>
                </template>
              </v-text-field>
            </v-form>
            <v-btn
              block
              depressed
              color="secondary"
              @click="isLogin = !isLogin"
            >
              {{ texts.button }}
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              large
              @click="submit"
            >
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>

          <v-snackbar v-model="showSnackbar" top>
            <div class="snackbar">
              <span>{{ error }}</span>
              <v-btn color="pink" icon @click="showSnackbar = false">
                <v-icon>close</v-icon>
              </v-btn>
            </div>
          </v-snackbar>

        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import AuthService from './../services/auth-service'
import { formatError } from '@/utils'

export default {
  name: 'Login',
  data: () => ({
    error: undefined,
    isLogin: true,
    isloading: false,
    showSnackbar: false,
    showPassword: false,
    user: {
      name: '',
      email: '',
      password: ''
    }
  }),
  validations() {
    const validations = {
      user: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(6)
        }
      }
    }
    if (this.isLogin) { return validations }
    return {
      user: {
        ...validations.user,
        name: {
          required,
          minLength: minLength(3)
        }
      }
    }
  },
  computed: {
    texts() {
      return this.isLogin
        ? { toolbar: 'Entrar', button: 'Criar conta' }
        : { toolbar: 'Criar conta', button: 'Já tenho uma conta' }
    },
    nameErrors () {
      const errors = []
      const name = this.$v.user.name
      if (!name.$dirty) return errors
      !name.required && errors.push('Nome é obrigatório!')
      !name.minLength && errors.push(`Insira pelo menos ${name.$params.minLength.min} caracteres!`)
      return errors
    },
    emailErrors() {
      const errors = []
      const email = this.$v.user.email
      if(!email.$dirty) return errors
      !email.required && errors.push('Email é obigatório!')
      !email.email && errors.push('Insira um e-mail válido!')
      return errors
    },
    passwordErrors() {
      const errors = []
      const password = this.$v.user.password
      if(!password.$dirty) return errors
      !password.required && errors.push('Senha é obigatório!')
      !password.minLength && errors.push(`Insira pelo menos ${password.$params.minLength.min} caracteres!`)
      return errors
    },
    progress () {
      return Math.min(100, this.user.password.length * 16.66)
    },
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    }
  },
  methods: {
    async submit() {
      this.isloading = true
      try {
        this.isLogin
          ? await AuthService.login(this.user)
          : await AuthService.signup(this.user)
        this.$router.push(this.$route.query.redirect || '/dashboard')
      } catch(error) {
        this.error = formatError(error.message)
        this.showSnackbar = true
      } finally { this.isloading = false }
    }
  }
}
</script>

<style scoped>
.snackbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
