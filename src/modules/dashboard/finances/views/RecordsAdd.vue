<template>
  <v-container text-center class="mt-8">
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg4
      >
        <NumericDisplay
          v-model="$v.record.amount.$model"
          :color="color"
          :value="355.55"
        />
      </v-flex>
      <v-flex xs12 sm6 md8 lg8
      >
        <v-card>
          <v-card-text>
            <v-form>

              <v-dialog
                ref="dateDialog"
                :return-value.sync="record.date"
                v-model="showDateDialog"
                persistent
                lazy
                width="290px"
                full-width
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    name="date"
                    label="Vencimento"
                    prepend-icon="event"
                    type="text"
                    readonly
                    :value="formattedDate"
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  scrollable
                  v-model="dateDialogValue"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    :color="color"
                    @click="cancelDateDialog"
                  >Cancelar</v-btn>

                  <v-btn
                    flat
                    :color="color"
                    @click="$refs.dateDialog.save(dateDialogValue)"
                  >OK</v-btn>
                </v-date-picker>
              </v-dialog>

              <v-select
                name="account"
                label="Conta"
                prepend-icon="account_balance"
                :items="accounts"
                item-text="description"
                item-value="id"
                v-model="$v.record.accountId.$model"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @mousedown.prevent
                    @click="add('account')"
                  >
                    <v-list-item-action>
                      <v-icon>add</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Conta</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>

              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.categoryId.$model"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @mousedown.prevent
                    @click="add('category')"
                  >
                    <v-list-item-action>
                      <v-icon>add</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Categoria</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>

              <v-text-field
                name="description"
                label="Descrição"
                prepend-icon="description"
                type="text"
                v-model.trim="$v.record.description.$model"
              ></v-text-field>

              <v-text-field
                v-show="showTagsInput"
                name="tags"
                label="Tags (separadas por vírgula)"
                prepend-icon="label"
                type="text"
                v-model.trim="record.tags"
              ></v-text-field>

              <v-text-field
                v-show="showNoteInput"
                name="note"
                label="Observação"
                prepend-icon="note"
                type="text"
                v-model.trim="record.note"
              ></v-text-field>

            </v-form>

            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  class="mr-3"
                  v-bind="attrs"
                  v-on="on"
                  @click="showTagsInput = !showTagsInput"
                >
                  <v-icon :color="color">label</v-icon>
                </v-btn>
              </template>
              <span>Adicionar tags</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="showNoteInput = !showNoteInput"
                >
                  <v-icon :color="color">note</v-icon>
                </v-btn>
              </template>
              <span>Observação</span>
            </v-tooltip>

          </v-card-text>
        </v-card>

        <v-btn
          color="secondary"
          large
          fab
          class="mt-4 mr-4"
          @click="$router.back()"
        >
          <v-icon>close</v-icon>
        </v-btn>

        <v-btn
          :color="color"
          large
          fab
          class="mt-4"
          @click="submit"
          :disabled="$v.$invalid"
        >
          <v-icon>check</v-icon>
        </v-btn>

        <v-dialog
          v-model="showAccountCategoryDialog"
          max-width="350px"
        >
          <AccountCategoryAdd
            v-if="showAccountCategoryDialog"
            :entity="entity"
            @close="showAccountCategoryDialog = false"
            @saved="accountCategorySaved"
          />
        </v-dialog>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { decimal, minLength, required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { Subject } from 'rxjs'
import { distinctUntilChanged, mergeMap } from 'rxjs/operators'

import AccountCategoryAdd from './../components/AccountCategoryAdd.vue'
import AccountsService from './../services/accounts-service'
import CategoriesService from './../services/categories-service'
import NumericDisplay from './../components/NumericDisplay.vue'
import RecordsService from './../services/records-service'

export default {
  name: 'RecordsAdd',
  components: { NumericDisplay, AccountCategoryAdd },
  data() {
    return {
      accounts: [],
      categories: [],
      dateDialogValue: moment().format('YYYY-MM-DD'),
      entity: '',
      operationSubject$: new Subject(),
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        accountId: '',
        categoryId: '',
        description: '',
        tags: '',
        note: ''
      },
      showAccountCategoryDialog: false,
      showDateDialog: false,
      showTagsInput: false,
      showNoteInput: false,
      subscriptions: []
    }
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: value => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(6) }
    }
  },
  computed: {
    color() {
      switch (this.record.type) {
        case 'CREDIT':
          return 'primary'
        case 'DEBIT':
          return 'danger'
        default:
          return 'primary'
      }
    },
    formattedDate() {
      return moment(this.record.date).format('DD/MM/YYYY')
    }
  },
  async created() {
    this.changeTitle(this.$route.query.type)

    this.subscriptions.push(
      AccountsService.accounts()
        .subscribe(accounts => (this.accounts = accounts))
    )

    this.subscriptions.push(
      this.operationSubject$
        .pipe(
          distinctUntilChanged(),
          mergeMap(operation => CategoriesService.categories({ operation }))
        ).subscribe(categories => (this.categories = categories))
    )

    this.operationSubject$.next(this.$route.query.type)
  },
  async beforeRouteUpdate(to, from, next) {
    const { type } = to.query
    this.changeTitle(to.query.type)
    this.record.type = type.toUpperCase()
    this.record.categoryId = ''
    this.operationSubject$.next(type)
    next()
  },
  destroyed() {
    this.subscriptions.forEach(s => s.unsubscribe())
  },
  methods: {
    ...mapActions(['setTitle']),
    accountCategorySaved(item) {
      this.showAccountCategoryDialog = false
      this.record[`${this.entity}Id`] = item.id
    },
    add(entity) {
      this.showAccountCategoryDialog = true
      this.entity = entity
    },
    cancelDateDialog() {
      this.showDateDialog = false
      this.dateDialogValue = this.record.date
    },
    changeTitle(recordType) {
      let title
      switch (recordType) {
        case 'credit':
          title = 'Nova Receita'
          break
        case 'debit':
          title = 'Nova Despesa'
          break
        default:
          title = 'Novo Lançamento'
      }
      this.setTitle({ title })
    },
    async submit() {
      try {
        await RecordsService.createRecord(this.record)
        this.$router.push('/dashboard/records')
      } catch(err) {
        console.error('Error creating Record: ', err)
      }
    }
  }
}
</script>
