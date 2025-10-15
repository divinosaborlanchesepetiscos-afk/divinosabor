# Guia de Autenticação de Usuário com Supabase no React

Este guia detalha os passos para configurar a autenticação de usuário em uma aplicação React utilizando o Supabase. O Supabase oferece uma solução de autenticação robusta e fácil de integrar, suportando diversos métodos de login, como e-mail/senha, magic link e provedores sociais [1].

## 1. Criar um Projeto Supabase

O primeiro passo é configurar um novo projeto no painel do Supabase. Este projeto incluirá um banco de dados PostgreSQL com uma tabela `auth.users` para gerenciar os usuários. Você pode iniciar um novo projeto através do [Dashboard do Supabase](https://supabase.com/dashboard/projects).

Após a criação do projeto, você pode verificar a tabela de usuários executando a seguinte consulta SQL no [SQL Editor](https://supabase.com/dashboard/project/itfabqajajixkyokgrlm/editor/28001) do Supabase:

```sql
select * from auth.users;
```

## 2. Criar uma Aplicação React

Para este guia, utilizaremos o Vite para criar uma nova aplicação React. Abra seu terminal e execute o seguinte comando:

```bash
npm create vite@latest my-app -- --template react
```

Navegue até o diretório da sua nova aplicação:

```bash
cd my-app
```

## 3. Instalar as Bibliotecas Cliente do Supabase

Para interagir com o Supabase Auth no seu aplicativo React, você precisará instalar as bibliotecas `@supabase/supabase-js`, `@supabase/auth-ui-react` e `@supabase/auth-ui-shared`. A biblioteca `auth-ui-react` fornece componentes de UI pré-construídos para autenticação, facilitando a integração [1].

No diretório da sua aplicação React, execute:

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

## 4. Configurar o Componente de Login

No arquivo `src/App.jsx` da sua aplicação React, você precisará criar uma instância do cliente Supabase usando a URL do seu projeto e a chave `anon` (ou `sb_publishable_key`). Em seguida, você pode usar o componente `Auth` do `@supabase/auth-ui-react` para exibir a interface de login.

É importante notar que o Supabase está atualizando a forma como as chaves de API funcionam. Você pode usar a chave `anon` para operações do lado do cliente ou a nova `sb_publishable_key` [1]. Ambas podem ser encontradas na seção de [API Keys do seu projeto Supabase](https://supabase.com/dashboard/project/_/settings/api).

Substitua o conteúdo de `src/App.jsx` pelo seguinte código:

```jsx
import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  'https://<SUA_PROJECT_URL>.supabase.co',
  '<SUA_ANON_KEY_OU_PUBLISHABLE_KEY>'
)

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
            redirectTo="http://localhost:3000"
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Logado!</h2>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>
    )
  }
}
```

**Observações:**

*   Substitua `<SUA_PROJECT_URL>` e `<SUA_ANON_KEY_OU_PUBLISHABLE_KEY>` pelas suas credenciais do Supabase. A URL do projeto pode ser encontrada no Dashboard do Supabase, na seção "Settings" > "API".
*   O componente `Auth` pode ser configurado com diferentes `providers` (ex: `'google'`, `'github'`) e um `redirectTo` URL após o login.
*   O `useEffect` monitora o estado da sessão do usuário e atualiza o estado local `session`.

## 5. Iniciar a Aplicação

Com a configuração concluída, você pode iniciar sua aplicação React. No terminal, execute:

```bash
npm run dev
```

Abra seu navegador e acesse `http://localhost:3000`. Você deverá ver a interface de autenticação do Supabase. Após o login, a mensagem "Logado!" será exibida.

## Referências

[1] Supabase Docs. (n.d.). *Use Supabase Auth with React*. Disponível em: [https://supabase.com/docs/guides/auth/quickstarts/react](https://supabase.com/docs/guides/auth/quickstarts/react)

