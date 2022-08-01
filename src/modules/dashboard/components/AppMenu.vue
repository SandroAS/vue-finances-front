<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    :mini-variant.sync="mini"
    absolute
    temporary
  >
    <v-list>

      <v-list-item
        v-if="mini"
        @click.stop="mini = !mini"
      >
        <v-list-item-action>
          <v-icon>chevron_right</v-icon>
        </v-list-item-action>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>person</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

    </v-list>

    <v-list
      class="pt-0"
      dense
    >
      <v-divider light></v-divider>

      <v-list-item-group
        color="primary"
        active-class="active-class"
      >
        <v-list-item
          v-for="menuItem in menuList"
          :key="menuItem.title"
          :to="menuItem.url"
          :exact="menuItem.exact"
          @click.stop="$emit('input', false)"
        >
          <v-list-item-action>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
import AuthService from '@/modules/auth/services/auth-service'

export default {
  name: 'AppMenuDashboard',
  props: {
    value: Boolean
  },
  data: () => ({
    menuList: [
      { title: 'Home', icon: 'dashboard', url: '/dashboard', exact: true }
    ],
    mini: false,
    user: {}
  }),
  async created() {
    this.user = await AuthService.user()
  }
}
</script>

<style>
  .active-class::before {
    background-color: transparent;
  }
</style>
