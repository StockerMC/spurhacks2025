// 100% vibe coded file

import { MCPPlaywrightClient } from './client';

interface TestCase {
  name: string;
  url: string;
  objective: string;
  description: string;
}

const testCases: TestCase[] = [
  {
    name: "Basic Navigation Test",
    url: "https://example.com",
    objective: "Navigate to the website and verify the main content loads properly",
    description: "Tests basic page loading and content verification"
  },
  {
    name: "Google Search Test", 
    url: "https://www.google.com",
    objective: "Search for 'playwright testing' and verify results appear",
    description: "Tests form interaction and search functionality"
  },
  {
    name: "GitHub Test",
    url: "https://github.com",
    objective: "Navigate to GitHub homepage and check if the main navigation is visible",
    description: "Tests navigation elements and page structure"
  }
];

class ClientTester {
  private client: MCPPlaywrightClient;

  constructor() {
    this.client = new MCPPlaywrightClient();
  }
  async runSingleTest(testCase: TestCase): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log(`🧪 Running Test: ${testCase.name}`);
    console.log(`📝 Description: ${testCase.description}`);
    console.log(`🔗 URL: ${testCase.url}`);
    console.log(`🎯 Objective: ${testCase.objective}`);
    console.log('='.repeat(60));

    const startTime = Date.now();

    try {
      const connected = await this.client.connect();
      if (!connected) {
        console.error('❌ Failed to connect to MCP server');
        return;
      }

      // Run test with up to 3 iterations
      const result = await this.client.testWebsite(testCase.url, testCase.objective, 3);
      const duration = Date.now() - startTime;

      if (result.success) {
        console.log('✅ Test completed successfully!');
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`🔄 Completed in ${result.iterations} iterations`);
        console.log('📊 Result:', result.result);
      } else {
        console.log('❌ Test failed!');
        console.log(`🔄 Attempted ${result.iterations} iterations`);
        console.log('🔍 Error:', result.error || 'Test objective was not achieved');
      }

    } catch (error) {
      console.error('💥 Test execution error:', error);
    } finally {
      await this.client.disconnect();
    }
  }
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive client testing...\n');
    
    let passedTests = 0;
    let totalTests = testCases.length;
    
    // Create a single client instance for all tests
    const client = new MCPPlaywrightClient();
    
    try {
      // Connect once at the beginning
      const connected = await client.connect();
      if (!connected) {
        console.error('❌ Failed to connect to MCP server');
        return;
      }
      
      for (const testCase of testCases) {
        try {
          console.log('\n' + '='.repeat(60));
          console.log(`🧪 Running Test: ${testCase.name}`);
          console.log(`📝 Description: ${testCase.description}`);
          console.log(`🔗 URL: ${testCase.url}`);
          console.log(`🎯 Objective: ${testCase.objective}`);
          console.log('='.repeat(60));
            const startTime = Date.now();
          
          // Run test with up to 3 iterations
          const result = await client.testWebsite(testCase.url, testCase.objective, 3);
          const duration = Date.now() - startTime;
          
          if (result.success) {
            console.log('✅ Test completed successfully!');
            console.log(`⏱️  Duration: ${duration}ms`);
            console.log(`🔄 Completed in ${result.iterations} iterations`);
            console.log('📊 Result:', result.result);
            passedTests++;
            console.log('✅ Test passed\n');
          } else {
            console.log('❌ Test failed!');
            console.log(`🔄 Attempted ${result.iterations} iterations`);
            console.log('🔍 Error:', result.error || 'Test objective was not achieved');
            console.log('❌ Test failed\n');
          }
        } catch (error) {
          console.log('❌ Test failed\n');
          console.error('Error:', error);
        }
        
        // Wait between tests to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } finally {
      // Disconnect once at the end
      await client.disconnect();
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`📈 TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
    console.log('='.repeat(60));
  }

  async testConnection(): Promise<boolean> {
    console.log('🔍 Testing MCP connection...');
    
    try {
      const connected = await this.client.connect();
      if (!connected) {
        console.error('❌ Connection test failed');
        return false;
      }

      console.log('✅ Connection test passed');
      await this.client.disconnect();
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }  async customTest(url: string, objective: string, maxIterations: number = 3): Promise<void> {
    console.log('\n🎯 Running custom test...');
    console.log(`🔄 Maximum iterations: ${maxIterations}`);
    
    const testCase: TestCase = {
      name: "Custom Test",
      url,
      objective,
      description: "User-defined custom test"
    };

    try {
      await this.runSingleTest(testCase);
    } catch (error) {
      console.error('❌ Custom test failed:', error);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const tester = new ClientTester();

  if (args.length === 0) {
    console.log(`
🧪 MCP Playwright Client Tester
===============================

Usage:
  bun run src/test-client.ts [command] [options]

Commands:
  connection          - Test MCP server connection only
  single <index> [iterations] - Run a specific test case (0-${testCases.length - 1}), with optional max iterations
  all [iterations]    - Run all predefined test cases, with optional max iterations
  custom <url> <objective> [iterations] - Run a custom test with your URL and objective, with optional max iterations

Examples:
  bun run src/test-client.ts connection
  bun run src/test-client.ts single 0
  bun run src/test-client.ts single 0 5
  bun run src/test-client.ts all
  bun run src/test-client.ts all 5
  bun run src/test-client.ts custom "https://example.com" "Check if the page loads"
  bun run src/test-client.ts custom "https://example.com" "Check if the page loads" 5

Available Test Cases:
${testCases.map((test, index) => `  ${index}: ${test.name} - ${test.url}`).join('\n')}
`);
    return;
  }

  const command = args[0];

  switch (command) {
    case 'connection':
      await tester.testConnection();
      break;

    case 'single':
      const index = parseInt(args[1]);
      if (isNaN(index) || index < 0 || index >= testCases.length) {
        console.error(`❌ Invalid test index. Use 0-${testCases.length - 1}`);
        return;
      }
      const singleIterations = args[2] ? parseInt(args[2]) : 3;
      await tester.runSingleTest(testCases[index]);
      break;

    case 'all':
      const allIterations = args[1] ? parseInt(args[1]) : 3;
      await tester.runAllTests();
      break;

    case 'custom':
      if (args.length < 3) {
        console.error('❌ Custom test requires URL and objective');
        console.log('Usage: bun run src/test-client.ts custom <url> <objective> [iterations]');
        return;
      }
      const url = args[1];
      
      // Check if the last argument is a number (iterations)
      let objective;
      let iterations = 3; // Default
      
      if (args.length >= 4 && !isNaN(parseInt(args[args.length - 1]))) {
        // Last argument is a number, use it as iterations
        iterations = parseInt(args[args.length - 1]);
        objective = args.slice(2, args.length - 1).join(' ');
      } else {
        // No iterations specified, use all remaining args as objective
        objective = args.slice(2).join(' ');
      }
      
      await tester.customTest(url, objective, iterations);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run without arguments to see usage information.');
  }
}

// Run if this file is executed directly
// Check multiple conditions for different runtimes (Node.js, Bun)
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1]?.endsWith('test-client.ts') ||
                     process.argv[1]?.endsWith('test-client.js');

if (isMainModule) {
  main().catch(console.error);
}

export { ClientTester };
