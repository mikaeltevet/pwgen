import React, { useState, useEffect, useCallback } from 'react'
import {
  Grid,
  Col,
  Paper,
  Slider,
  Switch,
  Text,
  Button,
  Badge,
} from '@mantine/core'
import { HiClipboardCopy } from 'react-icons/hi'
import { BiKey } from 'react-icons/bi'

// Define the type for the options
interface OptionsType {
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

// Define the character sets for each option
const CHAR_SETS: { [key in keyof OptionsType]: string } = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+{}:"<>?~',
}

const App: React.FC = () => {
  const [length, setLength] = useState<number>(24)
  const [options, setOptions] = useState<OptionsType>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState<string>('')

  const generatePassword = useCallback(() => {
    const charGroups: string[][] = []

    Object.keys(options).forEach((key) => {
      if (options[key as keyof OptionsType]) {
        charGroups.push(CHAR_SETS[key as keyof OptionsType].split(''))
      }
    })

    if (!charGroups.length) {
      setPassword('')
      return
    }

    const result: string[] = []
    for (let i = 0; i < length; i++) {
      const group = charGroups[i % charGroups.length]
      result.push(group[Math.floor(Math.random() * group.length)])
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    setPassword(result.join(''))
  }, [length, options])

  useEffect(() => {
    generatePassword()
  }, [length, options, generatePassword])

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password)
  }

  const getPasswordStrength = (password: string): string => {
    const characterTypes = {
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z\d]/.test(password),
    }

    const characterTypeCount =
      Object.values(characterTypes).filter(Boolean).length

    if (password.length >= 24 && characterTypeCount === 4) {
      return 'Strong'
    }

    if (password.length >= 18 && characterTypeCount >= 3) {
      return 'Good'
    }

    if (password.length >= 12 || characterTypeCount >= 2) {
      return 'Fair'
    }

    return 'Weak'
  }

  const getPasswordColor = (strength: string): string => {
    switch (strength) {
      case 'Weak':
        return 'red'
      case 'Fair':
        return 'orange'
      case 'Good':
        return 'yellow'
      case 'Strong':
        return 'green'
      default:
        return ''
    }
  }

  return (
    <Grid
      gutter='md'
      justify='center'
      style={{ margin: '2rem', padding: '1rem' }}
      className='container'
    >
      <Col span={12} sm={8} md={6} lg={4}>
        <Paper shadow='lg' radius='md'>
          <Text
            size='xl'
            weight={700}
            style={{
              marginBottom: '1rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <BiKey style={{ margin: '1rem' }} />
            Password Generator
          </Text>
          <Text style={{ margin: '1rem', color: '#ddd' }}>
            Password length: {length}
          </Text>
          <Slider
            value={length}
            onChange={setLength}
            min={8}
            max={32}
            style={{ margin: '1rem' }}
          />
          {Object.keys(options).map((key) => (
            <Switch
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              checked={options[key as keyof OptionsType]}
              onChange={() =>
                setOptions((prev) => ({
                  ...prev,
                  [key as keyof OptionsType]: !prev[key as keyof OptionsType],
                }))
              }
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '1rem',
              }}
            />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              margin: '2rem',
            }}
          >
            <Button
              onClick={generatePassword}
              style={{ background: '#1864ab', color: '#fff' }}
            >
              Generate
            </Button>
            <Button
              onClick={copyPasswordToClipboard}
              rightIcon={<HiClipboardCopy />}
              color='gray'
              variant='outline'
              style={{ color: '#fff' }}
            >
              Copy
            </Button>
          </div>
          <Paper
            radius='md'
            style={{
              background: '#1864ab',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <Text size='md' style={{ color: '#fff' }}>
              {password}
            </Text>
            <Badge
              color={getPasswordColor(getPasswordStrength(password))}
              style={{ marginTop: '1rem' }}
              variant='outline'
              size='lg'
              radius='md'
            >
              {getPasswordStrength(password)}
            </Badge>
          </Paper>
        </Paper>
      </Col>
    </Grid>
  )
}

export default App
