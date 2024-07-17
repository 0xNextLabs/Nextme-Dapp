interface IUserProPermissionConfig {
  hiddenAddress?: boolean
}
interface IUserProPermission {
  status: boolean
  config: IUserProPermissionConfig
}

interface PayloadWithUser {
  id: string
  did: string
}
