"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'

export default function Component() {
  const [names, setNames] = useState(['Shauno', 'Hinloke', 'Martooga', 'Zeeboh', 'Trok'])
  const [results, setResults] = useState<{ name: string; role: string }[]>([])

  const roles = ['Jungle', 'Mid', 'Top', 'Support', 'ADC'] as const
  type Role = typeof roles[number] // This creates a union type of 'Jungle' | 'Mid' | 'Top' | 'Support' | 'ADC'

  const roleIcons: Record<Role, string> = {
    Jungle: '/jungle.png',
    Mid: '/mid.png',
    Top: '/top.png',
    Support: '/support.png',
    ADC: '/bot.png'
  }

  const roleColors: Record<Role, string> = {
    Jungle: 'bg-green-500',
    Mid: 'bg-red-500',
    Top: 'bg-orange-500',
    Support: 'bg-blue-500',
    ADC: 'bg-purple-500'
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names]
    newNames[index] = value
    setNames(newNames)
  }

  const assignRoles = () => {
    if (names.some(name => name.trim() === '')) {
      alert('Please enter all 5 names.')
      return
    }

    const previousAssignments = new Map(results.map(result => [result.name, result.role]))

    let newResults: { name: string; role: Role; roleIcon: string }[] = []

    let shuffledRoles: Role[]
    let validAssignment = false

    // Can optimise to be O(N) if used set theory to assign roles. 
    while (!validAssignment) {
      shuffledRoles = [...roles].sort(() => Math.random() - 0.5) as Role[] // Shuffle roles
      newResults = names.map((name, index) => ({
        name,
        role: shuffledRoles[index] as Role, // Assert that shuffledRoles[index] is of type Role
        roleIcon: roleIcons[shuffledRoles[index] as Role] // Use type assertion here
      }))

      validAssignment = !newResults.some(result => previousAssignments.get(result.name) === result.role)
    }

    setResults(newResults)
  }

  return (
    <div className="w-full min-h-screen mx-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
      style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-2 md:flex-row md:space-x-4">
        <img src="/skt102.png" alt="SKT Logo" className="w-40 h-40" />
        <h1 className="bubbleTitle text-6xl sm:text-7xl">
          SKT10 Role Assigner
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SKT T10 Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {names.map((name, index) => (
                <Input
                  key={index}
                  placeholder={`Enter name ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  aria-label={`Name ${index + 1}`}
                />
              ))}
            </div>
            <Button onClick={assignRoles} className="w-full">
              <Shuffle className="mr-2 h-4 w-4" />
              Assign Roles
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    className={`${roleColors[result.role as Role]} rounded-lg p-4`} // Type assertion to Role here too
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-2">
                      <img src={roleIcons[result.role as Role]} alt={result.role} className="w-6 h-6 mr-2" /> 
                      <h3 className="text-xl font-bold text-white">{result.name}</h3>
                    </div>
                    <p className="text-lg text-white">{result.role}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
