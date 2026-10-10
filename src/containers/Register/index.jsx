import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Logo from '../../assets/logo_burguer.svg';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import {
  Container,
  InputContainer,
  Form,
  Title,
  RightContainer,
  LeftContainer,
  Link,
} from './styles';

export function Register() {
  const navegate = useNavigate();
  const schema = yup
    .object({
      name: yup.string().required('O name é obrigatorio'),
      email: yup
        .string()
        .email('Digite um email válido')
        .required('O e-mail é obrigatorio'),
      password: yup
        .string()
        .required('A senha é obrigatorio')
        .min(6, 'A senha de ter pelo menos 6 digitos'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
        .required('Confirme sua senha'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log(errors);

  const onSubmit = async (data) => {
    try {
      const { status } = await api.post(
        '/users',
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          validateStatus: () => true, // Aceita qualquer código HTTP (200, 400, 500, etc.) sem lançar erro
        }
      );

      if (status === 200 || status === 201) {
        setTimeout(() => {
          navegate('/login');
        }, 2000);
        toast.success('Conta criada com sucesso!');
      } else if (status === 409) {
        toast.error('Email já existe, Faça login para continuar');
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Falha no Sistema! Tente novamente');
    }
  };

  return (
    <Container>
      <LeftContainer>
        <img src={Logo} alt="logo_burguer" />
      </LeftContainer>

      <RightContainer>
        <Title>Criar Conta</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer>
            <label>Nome</label>
            <input type="text" {...register('name')} />
            <p>{errors?.name?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Email</label>
            <input type="text" {...register('email')} />
            <p>{errors?.email?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Senha</label>
            <input type="password" {...register('password')} />
            <p>{errors?.password?.message}</p>
          </InputContainer>

          <InputContainer>
            <label>Confirmar Senha</label>
            <input type="password" {...register('confirmPassword')} />
            <p>{errors?.confirmPassword?.message}</p>
          </InputContainer>

          <Button type="submit">Criar Conta</Button>
        </Form>

        <p>
          Já possui conta <Link to="/login">Clique aqui</Link>
        </p>
      </RightContainer>
    </Container>
  );
}
