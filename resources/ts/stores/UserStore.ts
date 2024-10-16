import {useAccountsStore} from './AccountsStore'

export const useUserStore = defineStore('user-store', () => {
  const userData = ref({
    id: undefined,
    role: 'guest',
    balance: 0,
  })

  const toast = ref()
  const ability = useAbility()
  const accessToken = useCookie('accessToken')
  const notifications = ref([])
  const settings = ref([])

  const userSettings = ref({})
  const userAbilityRules = ref([])

  const accountsStore = useAccountsStore()

  const setAbilities = (abilities: any) => {
    ability.update(abilities)
  }

  function fetchUserData(updateAbilities = false) {
    return $api('/user', {
      onResponseError({response}) {
        if (response.status === 401) {
          clearAllData()
        }
      },
      onResponse({response}) {
        userData.value = response._data.userData
        userAbilityRules.value = response._data.userAbilityRules
        notifications.value = response._data.notifications
        settings.value = response._data.settings

        if (updateAbilities)
          setAbilities(userAbilityRules.value)
      }
    })
   }

  const clearAllData = () => {
    accountsStore.clearData()
    userData.value = ({
      id: undefined,
      role: 'guest',
      balance: 0,
    })
    userAbilityRules.value = []
    userSettings.value = {}
    useCookie('userData').value = null
    useCookie('userAbilityRules').value = null
    useCookie('accessToken').value = null

    setAbilities(userAbilityRules.value)

    nextTick().then(() => window.location.reload()) // router.push('/login'))
  }
  const logout = () => {
    return $api('/user/auth/logout', {
      method: 'POST',
      async onResponse({ response }) {
        toast.value.success('Вы успешно вышли из системы')
        clearAllData()
      },
      onResponseError({ response }) {
        toast.value.error('Произошла ошибка')
      }
    })
  }

  onMounted( async () => {
    if(accessToken.value) {
      await fetchUserData().then(() => {
        setAbilities(userAbilityRules.value)
      })
    }
  })

  return {
    // 👉 state
    userData,
    userAbilityRules,
    ability,
    toast,
    notifications,
    settings,

    // 👉 getters

    // 👉 actions
    setAbilities,
    fetchUserData,
    logout,
    clearAllData,
  }
})
