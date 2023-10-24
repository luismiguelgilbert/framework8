export default {
  statusOptions: [
    { label: 'Todos los Usuarios', value: true, key: 1 },
  ],
  sortOptions: [
    { label: 'Ordenar por Nombres', value: 1 },
    { label: 'Ordenar por Apellidos', value: 2 },
    { label: 'Ordenar por Mail', value: 3 },
    { label: 'Ordenar por Perfil', value: 4 },
  ],
  columns: [
    { key: 'avatar_url', name: 'avatar_url', field: 'avatar_url', label: 'Foto', sortable: false },
    { key: 'user_name', name: 'user_name', field: 'user_name', label: 'Usuario', sortable: false },
    { key: 'last_sign_in_at', name: 'last_sign_in_at', field: 'last_sign_in_at', label: 'Último ingreso', sortable: false },
    //{ key: 'sys_profile_name', name: 'sys_profile_name', field: 'sys_profile_name', label: 'sys_profile_name', sortable: false },
    //{ key: 'is_active', name: 'is_active', field: 'is_active', label: 'Estado', sortable: false },
  ]
}